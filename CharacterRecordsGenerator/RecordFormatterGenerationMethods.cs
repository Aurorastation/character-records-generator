using Humanizer;
using System.Linq;
using System.Text;

namespace CharacterRecordsGenerator
{
    internal partial class RecordFormatter
    {
        private void MakeCommonRecords()
        {
            var record = new StringBuilder();
            record.AppendLine("/// PUBLIC RECORD ///");

            // TODO: most of this should be replaced by WriteRecordIfAny()
            if (_targetRecord.FirstName.Any())
            {
                record.AppendLine(MakeNameLine());
            }
            else
            {
                record.AppendLine("Name: Not specified.");
            }
            record.AppendLine($"Date of Birth: {_targetRecord.BirthDate.ToString("MMMM")} {_targetRecord.BirthDate.Day.Ordinalize()}, {_targetRecord.BirthDate.Year}");
            if (_targetRecord.Species != SpeciesType.None)
            {
                record.AppendLine($"Species: {_targetRecord.Species.Humanize()}"); // might fuck up the names
            } 
            else
            {
                record.AppendLine("Species: Not specified.");
            }
            if (_targetRecord.Subspecies != SpeciesSubType.None)
            {
                record.AppendLine($"{_targetRecord.Subspecies.GetAttributeOfType<SubspeciesMetaAttribute>()?.FieldName ?? "Subspecies"}: {Utility.SubspeciesNiceName(_targetRecord.Subspecies)}");
            }
            if (_targetRecord.Pronouns.Any())
            {
               record.AppendLine($"Pronouns: {_targetRecord.Pronouns}");
            }
            if (_targetRecord.Citizenship.Any()) {
                record.AppendLine($"Citizenship: {_targetRecord.Citizenship}");
            }
            if (_targetRecord.SpokenLanguages.Any())
            {
                record.AppendLine($"Spoken Languages: {_targetRecord.SpokenLanguages}");
            }
            if (_targetRecord.NextOfKin.Any()) {
                record.AppendLine($"Next of Kin: {_targetRecord.NextOfKin}");
            }
            if (_targetRecord.EmployedAs.Any()) {
                record.AppendLine($"Employed As: {_targetRecord.EmployedAs}");
            }
            if (_targetRecord.CharHeight != null)
                record.AppendLine($"Height: {_targetRecord.CharHeight} cm ({Utility.CmToFeet(_targetRecord.CharHeight.Value)})");

            if (_targetRecord.Weight != null)
                record.AppendLine($"Weight: {_targetRecord.Weight} kg ({Utility.KgToLb(_targetRecord.Weight ?? 0)} lb)");

            // Eye color
            if (_targetRecord.EyeColor.Any())
            {
                var trimmedEye = _targetRecord.EyeColor.Trim();
                record.AppendFormat("Eye Color: {0}\n", trimmedEye.Length > 0 ? trimmedEye : "Not specified.");
            }
            if (_targetRecord.SkinColor.Any())
            {
                var bodyColor = _targetRecord.SkinColor.Trim();
                record.AppendFormat("Skin/Body Color: {0}\n", bodyColor.Length > 0 ? bodyColor : "Not specified.");
            }
            if (_targetRecord.HairColor.Any())
            {
                var hairColor = _targetRecord.HairColor.Trim();
                record.AppendFormat("Hair Color: {0}\n", hairColor.Length > 0 ? hairColor : "Not specified.");
            }

            if (_targetRecord.DistinguishingFeatures.Any())
            {
                // identifying features
                var trimmedFeatures = _targetRecord.DistinguishingFeatures.Trim();
                record.Append("Distinguishing Features: ");
                record.AppendLine(trimmedFeatures.Length > 0 ? trimmedFeatures : "None noted.");
            }

            record.AppendLine();

            // general notes
            WriteSectionIfAny(ref record,
                "Additional Notes:",
                _publicNotes);

            _commonRecords = record.ToString();
        }

        private string MakeEmploymentRecords()
        {
            var recordText = new StringBuilder();
            if (_commonRecords.IsEmpty())
                MakeCommonRecords();

            recordText.Append(_commonRecords);

            if (!_employmentExperience.Any() &&
                !_employmentFormalEducation.Any() &&
                !_employmentSkills.Any())
            {
                recordText.AppendLine("/// NO EMPLOYMENT RECORD FOUND ///");
                recordText.AppendLine();
            }
            else
            {
                recordText.AppendLine("/// EMPLOYMENT RECORD ///");
                recordText.AppendLine("This information has been verified by employment agents within the External Affairs department, and any comments, questions, or concerns about the legitimacy of such must be sent in a secure document to the same department.");
                recordText.AppendLine();

                WriteSectionIfAny(ref recordText,
                    "Employment History:",
                    _employmentExperience);

                WriteSectionIfAny(ref recordText,
                    "Qualifications:",
                    _employmentFormalEducation);

                WriteSectionIfAny(ref recordText,
                    "Other skills:",
                    _employmentSkills);

            }

            recordText.AppendLine($"LAST UPDATED: {Utility.HumanisedDate(Info.IcDate)}");
            return recordText.ToString();
        }

        private string MakeMedicalRecords()
        {
            var recordText = new StringBuilder();
            if (_commonRecords.IsEmpty())
                MakeCommonRecords();

            recordText.Append(_commonRecords);

            // TODO: make this less horrible
            if (!_MedicalAllergies.Any() &&
                !_MedicalCurrentPrescriptions.Any() &&
                !_MedicalHistory.Any() &&
                !_MedicalSurgicalHistory.Any() &&
                !_MedicalPhysicalEvaluations.Any() &&
                !_MedicalPsychEvaluations.Any() &&
                !_MedicalPsychDisorders.Any() &&
                !_MedicalPostmortem.Any() &&
                !_targetRecord.NoBorg &&
                !_targetRecord.NoProsthetic &&
                !_targetRecord.NoRevive)
            {
                recordText.AppendLine("/// NO MEDICAL RECORD FOUND ///");
                recordText.AppendLine();
            }
            else
            {
                recordText.AppendLine("/// MEDICAL RECORD ///");
                recordText.AppendLine("The following information is protected by doctor-patient confidentiality laws. Do not release without patient's consent.");
                recordText.AppendLine();

                if (_targetRecord.NoBorg || _targetRecord.NoProsthetic || _targetRecord.NoRevive)
                {
                    recordText.AppendLine("OPT-OUTS:");

                    if (_targetRecord.NoBorg)
                        MakeMedicalNote(ref recordText, "DO NOT BORGIFY");
                    if (_targetRecord.NoProsthetic)
                        MakeMedicalNote(ref recordText, "DO NOT INSTALL PROSTHETICS");
                    if (_targetRecord.NoRevive)
                        MakeMedicalNote(ref recordText, "DO NOT REVIVE");

                    recordText.AppendLine();
                }

                WriteSectionIfAny(ref recordText,
                    "POSTMORTEM INSTRUCTIONS:",
                    _MedicalPostmortem);
                WriteSectionIfAny(ref recordText,
                    "ALLERGIES:",
                     _MedicalAllergies);
                WriteSectionIfAny(ref recordText,
                    "Current Prescriptions:",
                    _MedicalCurrentPrescriptions);
                WriteSectionIfAny(ref recordText,
                    "Surgical History:",
                    _MedicalSurgicalHistory);
                WriteSectionIfAny(ref recordText,
                    "Medication History:",
                    _MedicalHistory);
                WriteSectionIfAny(ref recordText,
                    "Physical Evaluations:",
                    _MedicalPhysicalEvaluations);   
                WriteSectionIfAny(ref recordText,
                    "Documented Psychological Disorders:",
                    _MedicalPsychDisorders);
                WriteSectionIfAny(ref recordText,
                    "Psychological Evaluations:",
                    _MedicalPsychEvaluations);


            }
            recordText.AppendLine($"LAST UPDATED: {Utility.HumanisedDate(Info.IcDate)}");
            return recordText.ToString();
        }

        private string MakeSecurityRecords()
        {
            var recordText = new StringBuilder();
            if (_commonRecords.IsEmpty())
                MakeCommonRecords();

            recordText.Append(_commonRecords);

            if (!_securityRecords.Any() &&
                !_securityNotes.Any() &&
                !_securityAttitudeScc.Any() &&
                !_securityAttitudeCrew.Any())
            {
                recordText.AppendLine("/// NO SECURITY RECORD FOUND ///");
                recordText.AppendLine();
            }
            else
            {
                recordText.AppendLine("/// SECURITY RECORD ///");
                recordText.AppendLine("This information has been verified by employment agents within the External Affairs department, and any comments, questions, or concerns about the legitimacy of such must be sent in a secure document to the same department.");
                recordText.AppendLine();

                WriteSectionIfAny(ref recordText,
                    "Attitude Towards the SCC:",
                    _securityAttitudeScc);
                WriteSectionIfAny(ref recordText,
                    "Attitude Towards the Crew:",
                    _securityAttitudeCrew);
                WriteSectionIfAny(ref recordText,
                    "Notes:",
                    _securityNotes);
                WriteSectionIfAny(ref recordText,
                    "Record:",
                    _securityRecords);
            }

            recordText.AppendLine($"LAST UPDATED: {Utility.HumanisedDate(Info.IcDate)}");
            return recordText.ToString();
        }
    }
}
